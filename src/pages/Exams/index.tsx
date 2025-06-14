import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  TimePicker,
  message,
  Space,
  Tag,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';

interface Exam {
  id: number;
  name: string;
  courseCode: string;
  examDate: string;
  startTime: string;
  duration: number;
  studentCount: number;
  needComputer: boolean;
  status: 'scheduled' | 'pending' | 'completed' | 'cancelled';
  examiner: { id: number; name: string };
  invigilator: { id: number; name: string };
  classroom: { id: number; name: string };
}

interface Teacher {
  id: number;
  name: string;
}

interface Classroom {
  id: number;
  name: string;
  capacity: number;
  hasComputers: boolean;
}

const { Option } = Select;

const Exams: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchExams();
    fetchTeachers();
    fetchClassrooms();
  }, []);

  const fetchExams = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/exams');
      const data = await response.json();
      setExams(data);
    } catch (error) {
      message.error('获取考试列表失败');
    }
    setLoading(false);
  };

  const fetchTeachers = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/teachers');
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      message.error('获取教师列表失败');
    }
  };

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/classrooms');
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      message.error('获取教室列表失败');
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Exam) => {
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
      examDate: moment(record.examDate),
      startTime: moment(record.startTime, 'HH:mm'),
      examinerId: record.examiner.id,
      invigilatorId: record.invigilator.id,
      classroomId: record.classroom.id,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/exams/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      fetchExams();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        examDate: values.examDate.format('YYYY-MM-DD'),
        startTime: values.startTime.format('HH:mm'),
      };

      const url = editingId
        ? `http://localhost:3000/api/exams/${editingId}`
        : 'http://localhost:3000/api/exams';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      message.success(`${editingId ? '更新' : '添加'}成功`);
      setModalVisible(false);
      fetchExams();
    } catch (error) {
      message.error(`${editingId ? '更新' : '添加'}失败`);
    }
  };

  const columns: ColumnsType<Exam> = [
    {
      title: '考试名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '课程代码',
      dataIndex: 'courseCode',
      key: 'courseCode',
    },
    {
      title: '考试日期',
      dataIndex: 'examDate',
      key: 'examDate',
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: '时长(分钟)',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '考生人数',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: '主考教师',
      dataIndex: ['examiner', 'name'],
      key: 'examiner',
    },
    {
      title: '监考教师',
      dataIndex: ['invigilator', 'name'],
      key: 'invigilator',
    },
    {
      title: '考试教室',
      dataIndex: ['classroom', 'name'],
      key: 'classroom',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          scheduled: { text: '已安排', color: 'green' },
          pending: { text: '待安排', color: 'orange' },
          completed: { text: '已完成', color: 'blue' },
          cancelled: { text: '已取消', color: 'red' },
        };
        const { text, color } = statusMap[status as keyof typeof statusMap];
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          添加考试
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={exams}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? '编辑考试' : '添加考试'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="考试名称"
            rules={[{ required: true, message: '请输入考试名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="courseCode"
            label="课程代码"
            rules={[{ required: true, message: '请输入课程代码' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="examDate"
            label="考试日期"
            rules={[{ required: true, message: '请选择考试日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="startTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <TimePicker format="HH:mm" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="duration"
            label="考试时长(分钟)"
            rules={[{ required: true, message: '请输入考试时长' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="studentCount"
            label="考生人数"
            rules={[{ required: true, message: '请输入考生人数' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="examinerId"
            label="主考教师"
            rules={[{ required: true, message: '请选择主考教师' }]}
          >
            <Select>
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="invigilatorId"
            label="监考教师"
            rules={[{ required: true, message: '请选择监考教师' }]}
          >
            <Select>
              {teachers.map(teacher => (
                <Option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="classroomId"
            label="考试教室"
            rules={[{ required: true, message: '请选择考试教室' }]}
          >
            <Select>
              {classrooms.map(classroom => (
                <Option key={classroom.id} value={classroom.id}>
                  {classroom.name} (容量: {classroom.capacity})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="scheduled">已安排</Option>
              <Option value="pending">待安排</Option>
              <Option value="completed">已完成</Option>
              <Option value="cancelled">已取消</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Exams; 