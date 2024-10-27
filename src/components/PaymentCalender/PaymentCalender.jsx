// import React, { useState, useEffect } from 'react';
// import { Calendar, Badge, Modal, Form, Input, DatePicker, Select, InputNumber, Card, Button, Tooltip } from 'antd';
// import { DollarOutlined, DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
// import dayjs from 'dayjs';

// const BillPaymentCalendar = () => {
//   const [bills, setBills] = useState([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingBill, setEditingBill] = useState(null);
//   const [form] = Form.useForm();

//   // Load bills from localStorage on component mount
//   useEffect(() => {
//     const savedBills = localStorage.getItem('bills');
//     if (savedBills) {
//       setBills(JSON.parse(savedBills));
//     }
//   }, []);

//   // Save bills to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem('bills', JSON.stringify(bills));
//   }, [bills]);

//   const handleAddBill = () => {
//     setEditingBill(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   const handleEditBill = (bill) => {
//     setEditingBill(bill);
//     form.setFieldsValue({
//       ...bill,
//       dueDate: dayjs(bill.dueDate)
//     });
//     setIsModalVisible(true);
//   };

//   const handleDeleteBill = (billId) => {
//     setBills(bills.filter(bill => bill.id !== billId));
//   };

//   const handleModalOk = () => {
//     form.validateFields().then(values => {
//       const newBill = {
//         id: editingBill ? editingBill.id : Date.now(),
//         name: values.name,
//         amount: values.amount,
//         dueDate: values.dueDate.format('YYYY-MM-DD'),
//         category: values.category,
//         status: values.status,
//         recurrence: values.recurrence,
//         notes: values.notes
//       };

//       if (editingBill) {
//         setBills(bills.map(bill => 
//           bill.id === editingBill.id ? newBill : bill
//         ));
//       } else {
//         setBills([...bills, newBill]);
//       }

//       setIsModalVisible(false);
//       form.resetFields();
//     });
//   };

//   const getListData = (value) => {
//     const dateStr = value.format('YYYY-MM-DD');
//     return bills.filter(bill => bill.dueDate === dateStr);
//   };

//   const dateCellRender = (value) => {
//     const listData = getListData(value);
//     return (
//       <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
//         {listData.map(bill => (
//           <li key={bill.id}>
//             <Badge
//               status={getBadgeStatus(bill.status)}
//               text={
//                 <Tooltip title={`${bill.name} -${bill.amount}`}>
//                   <span 
//                     style={{ cursor: 'pointer' }}
//                     onClick={() => handleEditBill(bill)}
//                   >
//                     Rs.{bill.amount} - {bill.name}
//                   </span>
//                 </Tooltip>
//               }
//             />
//           </li>
//         ))}
//       </ul>
//     );
//   };

//   const getBadgeStatus = (status) => {
//     switch (status) {
//       case 'paid':
//         return 'success';
//       case 'pending':
//         return 'warning';
//       case 'overdue':
//         return 'error';
//       default:
//         return 'default';
//     }
//   };

//   return (
//     <Card 
//       title="Bill Payment Calendar"
//       extra={
//         <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBill}>
//           Add Bill
//         </Button>
//       }
//       style={{ margin: '24px' }}
//     >
//       <Calendar dateCellRender={dateCellRender} />

//       <Modal
//         title={editingBill ? "Edit Bill" : "Add New Bill"}
//         open={isModalVisible}
//         onOk={handleModalOk}
//         onCancel={() => setIsModalVisible(false)}
//         width={600}
//       >
//         <Form
//           form={form}
//           layout="vertical"
//         >
//           <Form.Item
//             name="name"
//             label="Bill Name"
//             rules={[{ required: true, message: 'Please enter bill name' }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="amount"
//             label="Amount"
//             rules={[{ required: true, message: 'Please enter amount' }]}
//           >
//             <InputNumber 
//               prefix={<DollarOutlined />}
//               style={{ width: '100%' }}
//               min={0}
//               step={0.01}
//             />
//           </Form.Item>

//           <Form.Item
//             name="dueDate"
//             label="Due Date"
//             rules={[{ required: true, message: 'Please select due date' }]}
//           >
//             <DatePicker style={{ width: '100%' }} />
//           </Form.Item>

//           <Form.Item
//             name="category"
//             label="Category"
//             rules={[{ required: true, message: 'Please select category' }]}
//           >
//             <Select>
//               <Select.Option value="utilities">Utilities</Select.Option>
//               <Select.Option value="rent">Rent/Mortgage</Select.Option>
//               <Select.Option value="insurance">Insurance</Select.Option>
//               <Select.Option value="subscription">Subscription</Select.Option>
//               <Select.Option value="credit">Credit Card</Select.Option>
//               <Select.Option value="other">Other</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="status"
//             label="Status"
//             rules={[{ required: true, message: 'Please select status' }]}
//           >
//             <Select>
//               <Select.Option value="pending">Pending</Select.Option>
//               <Select.Option value="paid">Paid</Select.Option>
//               <Select.Option value="overdue">Overdue</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="recurrence"
//             label="Recurrence"
//             rules={[{ required: true, message: 'Please select recurrence' }]}
//           >
//             <Select>
//               <Select.Option value="once">One-time</Select.Option>
//               <Select.Option value="weekly">Weekly</Select.Option>
//               <Select.Option value="monthly">Monthly</Select.Option>
//               <Select.Option value="yearly">Yearly</Select.Option>
//             </Select>
//           </Form.Item>

//           <Form.Item
//             name="notes"
//             label="Notes"
//           >
//             <Input.TextArea />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </Card>
//   );
// };

// export default BillPaymentCalendar;


import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Form, Input, DatePicker, Select, InputNumber, Card, Button, Tooltip } from 'antd';
import { DollarOutlined, PlusOutlined } from '@ant-design/icons';
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
  const [user] = useAuthState(auth);
  const [form] = Form.useForm();

  // Fetch bills from Firebase on component mount
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
      toast.success("Bills fetched successfully!");
    } catch (error) {
      toast.error("Error fetching bills: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBill = () => {
    setEditingBill(null);
    form.resetFields();
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

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const billData = {
        name: values.name,
        amount: values.amount,
        dueDate: values.dueDate.format('YYYY-MM-DD'),
        category: values.category,
        status: values.status,
        recurrence: values.recurrence,
        notes: values.notes,
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
        // Add new bill
        const docRef = await addDoc(
          collection(db, `users/${user.uid}/bills`),
          billData
        );
        setBills([...bills, { ...billData, id: docRef.id }]);
        toast.success("Bill added successfully!");
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      toast.error("Error saving bill: " + error.message);
    }
  };

  const getListData = (value) => {
    const dateStr = value.format('YYYY-MM-DD');
    return bills.filter(bill => bill.dueDate === dateStr);
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none', padding: 0 }}>
        {listData.map(bill => (
          <li key={bill.id}>
            <Badge
              status={getBadgeStatus(bill.status)}
              text={
                <Tooltip title={`${bill.name} - ${bill.amount}`}>
                  <span 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleEditBill(bill)}
                  >
                    Rs.{bill.amount} - {bill.name}
                  </span>
                </Tooltip>
              }
            />
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

  return (
    <Card 
      title="Bill Payment Calendar"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBill}>
          Add Bill
        </Button>
      }
      style={{ margin: '24px' }}
    >
      {loading ? (
        <div>Loading bills...</div>
      ) : (
        <Calendar dateCellRender={dateCellRender} />
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
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber 
              prefix={<DollarOutlined />}
              style={{ width: '100%' }}
              min={0}
              step={0.01}
            />
          </Form.Item>

          <Form.Item
            name="dueDate"
            label="Due Date"
            rules={[{ required: true, message: 'Please select due date' }]}
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
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BillPaymentCalendar;