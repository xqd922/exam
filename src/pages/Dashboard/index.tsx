import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { UserOutlined, BookOutlined, ScheduleOutlined } from '@ant-design/icons';

interface DashboardStats {
  teacherCount: number;
  classroomCount: number;
  examCount: number;
  upcomingExams: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    teacherCount: 0,
    classroomCount: 0,
    examCount: 0,
    upcomingExams: 0,
  });

  useEffect(() => {
    // 获取统计数据
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
  };

  return (
    <div>
      <h2>系统概览</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="教师总数"
              value={stats.teacherCount}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="教室总数"
              value={stats.classroomCount}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="考试总数"
              value={stats.examCount}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="即将进行的考试"
              value={stats.upcomingExams}
              prefix={<ScheduleOutlined />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 