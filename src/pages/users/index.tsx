import { useState, useMemo } from "react";
import { Table, Input, Avatar, Typography, Card, Space, Spin, message } from "antd";
import { SearchOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import ContentLayout from "components/layout/content/contentLayout";
import { useGetUsers } from "hooks/react-query/users";
import { UserData } from "services/users/interface";

const { Title } = Typography;

interface UsersTableData extends UserData {
  key: string;
  fullName: string;
}

export function Users() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(13);
  const [firstNameFilter, setFirstNameFilter] = useState("");
  const [lastNameFilter, setLastNameFilter] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend' | null>(null);

  // Calculate skip value for API call
  const skip = (currentPage - 1) * pageSize;

  const { data, isLoading, isError } = useGetUsers(pageSize, skip);

  // Process data for table
  const tableData: UsersTableData[] = useMemo(() => {
    if (!data?.users) return [];

    let filteredUsers = data.users
      .filter(user =>
        user.firstName.toLowerCase().includes(firstNameFilter.toLowerCase()) &&
        user.lastName.toLowerCase().includes(lastNameFilter.toLowerCase())
      )
      .map(user => ({
        ...user,
        key: user.id.toString(),
        fullName: `${user.firstName} ${user.lastName}`,
      }));

    // Apply client-side sorting for email
    if (sortField === 'email' && sortOrder) {
      filteredUsers = filteredUsers.sort((a, b) => {
        if (sortOrder === 'ascend') {
          return a.email.localeCompare(b.email);
        } else {
          return b.email.localeCompare(a.email);
        }
      });
    }

    return filteredUsers;
  }, [data?.users, firstNameFilter, lastNameFilter, sortField, sortOrder]);

  const columns: ColumnsType<UsersTableData> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'First Name',
      dataIndex: 'firstName',
      key: 'firstName',
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search first name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => {
              setFirstNameFilter(selectedKeys[0] as string || '');
              confirm();
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={() => {
                setFirstNameFilter(selectedKeys[0] as string || '');
                confirm();
              }}
              style={{ width: 90 }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                clearFilters?.();
                setFirstNameFilter('');
                confirm();
              }}
              style={{ width: 90 }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.firstName.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Last Name',
      dataIndex: 'lastName',
      key: 'lastName',
      width: 120,
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search last name"
            value={selectedKeys[0]}
            onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => {
              setLastNameFilter(selectedKeys[0] as string || '');
              confirm();
            }}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Space>
            <button
              type="button"
              onClick={() => {
                setLastNameFilter(selectedKeys[0] as string || '');
                confirm();
              }}
              style={{ width: 90 }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                clearFilters?.();
                setLastNameFilter('');
                confirm();
              }}
              style={{ width: 90 }}
            >
              Reset
            </button>
          </Space>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) =>
        record.lastName.toLowerCase().includes(value.toString().toLowerCase()),
    },
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      render: (text, record) => (
        <Space>
          <Avatar
            src={record.image}
            icon={<UserOutlined />}
            size="small"
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      sorter: true,
      render: (email) => <Typography.Text copyable>{email}</Typography.Text>,
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image, record) => (
        // Using Avatar component to display user images in a consistent, circular format
        // This provides the best UX as avatars are specifically designed for profile pictures
        // and automatically handle loading states and fallbacks
        <Avatar
          src={image}
          size={40}
          icon={<UserOutlined />}
          alt={`${record.firstName} ${record.lastName}`}
        />
      ),
    },
  ];

  const handleTableChange: TableProps<UsersTableData>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    if (pagination) {
      setCurrentPage(pagination.current || 1);
      setPageSize(pagination.pageSize || 13);
    }

    if (sorter && !Array.isArray(sorter)) {
      if (sorter.field === 'email') {
        setSortField('email');
        setSortOrder(sorter.order || null);
      } else {
        setSortField(null);
        setSortOrder(null);
      }
    }
  };

  // Show error message if data fetching fails
  if (isError) {
    message.error('Failed to load users data');
  }

  return (
    <ContentLayout>
      <Card>
        <Title level={2} style={{ marginBottom: 24 }}>Users</Title>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>Loading users...</div>
          </div>
        ) : (
          <Table<UsersTableData>
            columns={columns}
            dataSource={tableData}
            loading={isLoading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: data?.total || 0,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} users`,
              pageSizeOptions: ['13', '25', '50', '100'],
            }}
            onChange={handleTableChange}
            scroll={{ x: 'max-content' }}
            size="middle"
            bordered
          />
        )}
      </Card>
    </ContentLayout>
  );
}