import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Badge, 
  Modal, 
  Form, 
  Input, 
  DatePicker, 
  Select, 
  InputNumber, 
  Card, 
  Button, 
  Tooltip,
  Popconfirm,
  Radio,
  Table,
  Space,
  Tag
} from 'antd';
import { 
  DollarOutlined, 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined,
  CalendarOutlined,
  UnorderedListOutlined
} from '@ant-design/icons';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

const BillPaymentCalendar = () => {
  const [bills, setBills] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingBill, setEditingBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
  const [user] = useAuthState(auth);
  const [form] = Form.useForm();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBills();
    }
  }, [user]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, `users/${user.uid}/bills`));
      const querySnapshot = await getDocs(q);
      const billsArray = [];
      querySnapshot.forEach((doc) => {
        billsArray.push({ ...doc.data(), id: doc.id });
      });
      setBills(billsArray);
    } catch (error) {
      toast.error("Error fetching bills: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = () => {
    setEditingBill(null);
    form.resetFields();
    form.setFieldsValue({
      dueDate: dayjs(), // Set default due date to today
      status: 'pending', // Set default status
      recurrence: 'once' // Set default recurrence
    });
    setIsModalVisible(true);
  };

  const handleEditBill = (bill) => {
    setEditingBill(bill);
    form.setFieldsValue({
      ...bill,
      dueDate: dayjs(bill.dueDate)
    });
    setIsModalVisible(true);
  };

  const handleDeleteBill = async (billId) => {
    try {
      await deleteDoc(doc(db, `users/${user.uid}/bills`, billId));
      setBills(bills.filter(bill => bill.id !== billId));
      toast.success("Bill deleted successfully!");
    } catch (error) {
      toast.error("Error deleting bill: " + error.message);
    }
  };

  const createRecurringBills = (billData, recurrence) => {
    const recurringBills = [];
    const baseDate = dayjs(billData.dueDate);
    
    // Create bills for the next 12 occurrences
    for (let i = 0; i < 12; i++) {
      let nextDate;
      switch (recurrence) {
        case 'weekly':
          nextDate = baseDate.add(i, 'week');
          break;
        case 'monthly':
          nextDate = baseDate.add(i, 'month');
          break;
        case 'yearly':
          nextDate = baseDate.add(i, 'year');
          break;
        default:
          return [billData]; // For one-time bills
      }
      
      recurringBills.push({
        ...billData,
        dueDate: nextDate.format('YYYY-MM-DD'),
        recurrenceGroup: billData.id // Link recurring bills together
      });
    }
    
    return recurringBills;
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      // Validate amount
      if (values.amount <= 0) {
        toast.error("Amount must be greater than 0");
        return;
      }

      // Validate due date not in past
      if (dayjs(values.dueDate).isBefore(dayjs(), 'day')) {
        toast.error("Due date cannot be in the past");
        return;
      }

      const billData = {
        name: values.name,
        amount: values.amount,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        category: values.category,
        status: values.status,
        recurrence: values.recurrence,
        notes: values.notes || '',
        createdAt: new Date().toISOString(),
        userId: user.uid
      };

      if (editingBill) {
        // Update existing bill
        const billRef = doc(db, `users/${user.uid}/bills`, editingBill.id);
        await updateDoc(billRef, billData);
        setBills(bills.map(bill => 
          bill.id === editingBill.id ? { ...billData, id: editingBill.id } : bill
        ));
        toast.success("Bill updated successfully!");
      } else {
        // Add new bill(s)
        const recurringBills = createRecurringBills(billData, values.recurrence);
        const addPromises = recurringBills.map(bill => 
          addDoc(collection(db, `users/${user.uid}/bills`), bill)
        );
        
        await Promise.all(addPromises);
        await fetchBills(); // Refresh bills to get new IDs
        toast.success("Bill(s) added successfully!");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Error saving bill: " + error.message);
    }
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return bills.filter(bill => {
      const matchesDate = bill.dueDate === dateStr;
      const matchesCategory = categoryFilter === 'all' || bill.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
      return matchesDate && matchesCategory && matchesStatus;
    });
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
        {listData.map(bill => (
          <li key={bill.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Badge
              status={getBadgeStatus(bill.status)}
              text={
                <Tooltip title={`${bill.name} - ${bill.amount} - ${bill.category}`}>
                  <span 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEditBill(bill)}
                  >
                    Rs.{bill.amount} - {bill.name}
                  </span>
                </Tooltip>
              }
            />
            <Popconfirm
              title="Delete this bill?"
              onConfirm={(e) => {
                e.stopPropagation();
                handleDeleteBill(bill.id);
              }}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                type="text" 
                danger 
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                <DeleteOutlined />
              </Button>
            </Popconfirm>
          </li>
        ))}
      </ul>
    );
  };

  const getBadgeStatus = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'orange';
      case 'overdue':
        return 'red';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `Rs.${amount}`,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => dayjs(a.dueDate).unix() - dayjs(b.dueDate).unix(),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Recurrence',
      dataIndex: 'recurrence',
      key: 'recurrence',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />} 
            onClick={() => handleEditBill(record)}
          />
          <Popconfirm
            title="Delete this bill?"
            onConfirm={() => handleDeleteBill(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredBills = bills.filter(bill => {
    const matchesCategory = categoryFilter === 'all' || bill.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  return (
    <Card 
      title="Bill Payment Calendar"
      extra={
        <Space>
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            style={{ width: 120 }}
          >
            <Select.Option value="all">All Categories</Select.Option>
            <Select.Option value="utilities">Utilities</Select.Option>
            <Select.Option value="rent">Rent/Mortgage</Select.Option>
            <Select.Option value="insurance">Insurance</Select.Option>
            <Select.Option value="subscription">Subscription</Select.Option>
            <Select.Option value="credit">Credit Card</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 120 }}
          >
            <Select.Option value="all">All Statuses</Select.Option>
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="paid">Paid</Select.Option>
            <Select.Option value="overdue">Overdue</Select.Option>
          </Select>
          <Radio.Group 
            value={viewMode} 
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
          >
            <Radio.Button value="calendar"><CalendarOutlined /> Calendar</Radio.Button>
            <Radio.Button value="list"><UnorderedListOutlined /> List</Radio.Button>
          </Radio.Group>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBill}>
            Add Bill
          </Button>
        </Space>
      }
      style={{ margin: '24px' }}
    >
      {loading ? (
        <div>Loading bills...</div>
      ) : viewMode === 'calendar' ? (
        <Calendar dateCellRender={dateCellRender} />
      ) : (
        <Table 
          columns={columns} 
          dataSource={filteredBills}
          rowKey="id"
          pagination={{ pageSize: 10 }}
        />
      )}

      <Modal
        title={editingBill ? "Edit Bill" : "Add New Bill"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Bill Name"
            rules={[{ required: true, message: 'Please enter bill name' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter amount' },
              { type: 'number', min: 0.01, message: 'Amount must be greater than 0' }
            ]}
          >
            <InputNumber 
              prefix={<DollarOutlined />}
              style={{ width: '100%' }}
              min={0.01}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[
              { required: true, message: 'Please select due date' },
              {
                validator: (_, value) => {
                  if (value && value.isBefore(dayjs(), 'day')) {
                    return Promise.reject('Due date cannot be in the past');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select category' }]}
          >
            <Select>
              <Select.Option value="utilities">Utilities</Select.Option>
              <Select.Option value="rent">Rent/Mortgage</Select.Option>
              <Select.Option value="insurance">Insurance</Select.Option>
              <Select.Option value="subscription">Subscription</Select.Option>
              <Select.Option value="credit">Credit Card</Select.Option>
              <Select.Option value="other">Other</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select>
              <Select.Option value="pending">Pending</Select.Option>
              <Select.Option value="paid">Paid</Select.Option>
              <Select.Option value="overdue">Overdue</Select.Option>
            </Select>
            </Form.Item>

<Form.Item
  name="recurrence"
  label="Recurrence"
  rules={[{ required: true, message: 'Please select recurrence' }]}
>
  <Select>
    <Select.Option value="once">One-time</Select.Option>
    <Select.Option value="weekly">Weekly</Select.Option>
    <Select.Option value="monthly">Monthly</Select.Option>
    <Select.Option value="yearly">Yearly</Select.Option>
  </Select>
</Form.Item>

<Form.Item
  name="notes"
  label="Notes"
>
  <Input.TextArea rows={3} placeholder="Additional notes (optional)" />
</Form.Item>
</Form>
</Modal>
</Card>
);
};

export default BillPaymentCalendar;
