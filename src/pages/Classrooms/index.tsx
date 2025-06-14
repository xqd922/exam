import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Switch, Select, message, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface Classroom {
  id: number;
  name: string;
  building: string;
  floor: number;
  capacity: number;
  hasComputers: boolean;
  status: 'available' | 'maintenance' | 'reserved';
}

const { Option } = Select;

const Classrooms: React.FC = () => {
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/classrooms');
      const data = await response.json();
      setClassrooms(data);
    } catch (error) {
      message.error('获取教室列表失败');
    }
    setLoading(false);
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Classroom) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3000/api/classrooms/${id}`, {
        method: 'DELETE',
      });
      message.success('删除成功');
      fetchClassrooms();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const url = editingId
        ? `http://localhost:3000/api/classrooms/${editingId}`
        : 'http://localhost:3000/api/classrooms';
      const method = editingId ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      message.success(`${editingId ? '更新' : '添加'}成功`);
      setModalVisible(false);
      fetchClassrooms();
    } catch (error) {
      message.error(`${editingId ? '更新' : '添加'}失败`);
    }
  };

  const columns: ColumnsType<Classroom> = [
    {
      title: '教室名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '教学楼',
      dataIndex: 'building',
      key: 'building',
    },
    {
      title: '楼层',
      dataIndex: 'floor',
      key: 'floor',
    },
    {
      title: '容量',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: '是否有电脑',
      dataIndex: 'hasComputers',
      key: 'hasComputers',
      render: (hasComputers: boolean) => (hasComputers ? '是' : '否'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap = {
          available: '可用',
          maintenance: '维护中',
          reserved: '已预约',
        };
        return statusMap[status as keyof typeof statusMap];
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
          添加教室
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={classrooms}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? '编辑教室' : '添加教室'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="教室名称"
            rules={[{ required: true, message: '请输入教室名称' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="building"
            label="教学楼"
            rules={[{ required: true, message: '请输入教学楼' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="floor"
            label="楼层"
            rules={[{ required: true, message: '请输入楼层' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="capacity"
            label="容量"
            rules={[{ required: true, message: '请输入容量' }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="hasComputers"
            label="是否有电脑"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="available">可用</Option>
              <Option value="maintenance">维护中</Option>
              <Option value="reserved">已预约</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Classrooms; 