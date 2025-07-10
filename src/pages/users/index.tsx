import { useState, useMemo, useEffect } from "react";
import { Table, Avatar, Typography, Card, Space, message, Spin } from "antd";
import { SearchOutlined, UserOutlined, LoadingOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useIntl } from "react-intl";
import ContentLayout from "components/layout/content/contentLayout";
import { useGetUsers } from "hooks/react-query/users";
import { UserData, UsersFilterParams, UsersSortParams } from "services/users/interface";
import { TextFilterDropdown } from "./components/TextFilterDropdown";

interface UsersTableData extends UserData {
  key: string;
  fullName: string;
}

export function Users() {
  const { formatMessage } = useIntl();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(13);
  const [filters, setFilters] = useState<UsersFilterParams>({});
  const [sort, setSort] = useState<UsersSortParams>({});

  const skip = (currentPage - 1) * pageSize;
  const { data, isLoading, isError, isFetching } = useGetUsers(pageSize, skip, filters, sort);

  // Handle error feedback
  useEffect(() => {
    if (isError) {
      message.error(formatMessage({ id: "page.users.error.loadFailed" }));
    }
  }, [isError, formatMessage]);

  const tableData: UsersTableData[] = useMemo(() => {
    if (!data?.users) return [];

    return data.users.map(user => ({
      ...user,
      key: user.id.toString(),
      fullName: `${user.firstName} ${user.lastName}`,
    }));
  }, [data?.users]);

  // Check if we're filtering or sorting (not initial load)
  const isFilteringOrSorting = useMemo(() => {
    return isFetching && !isLoading;
  }, [isFetching, isLoading]);

  const columns: ColumnsType<UsersTableData> = useMemo(() => [
    {
      title: (
        <Space>
          {formatMessage({ id: "page.users.column.id" })}
          {isFilteringOrSorting && sort.sortBy === 'id' && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </Space>
      ),
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
      sortOrder: sort.sortBy === 'id' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
    },
    {
      title: (
        <Space>
          {formatMessage({ id: "page.users.column.firstName" })}
          {isFilteringOrSorting && (filters.firstName || sort.sortBy === 'firstName') && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </Space>
      ),
      dataIndex: 'firstName',
      key: 'firstName',
      width: 120,
      filtered: !!filters.firstName,
      filterDropdown: (props) => (
        <TextFilterDropdown
          {...props}
          placeholder={formatMessage({ id: "page.users.filter.firstName.placeholder" })}
        />
      ),
      filterIcon: () => (
        <SearchOutlined />
      ),
      sorter: true,
      sortOrder: sort.sortBy === 'firstName' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
    },
    {
      title: (
        <Space>
          {formatMessage({ id: "page.users.column.lastName" })}
          {isFilteringOrSorting && (filters.lastName || sort.sortBy === 'lastName') && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </Space>
      ),
      dataIndex: 'lastName',
      key: 'lastName',
      width: 120,
      filtered: !!filters.lastName,
      filterDropdown: (props) => (
        <TextFilterDropdown
          {...props}
          placeholder={formatMessage({ id: "page.users.filter.lastName.placeholder" })}
        />
      ),
      filterIcon: () => (
        <SearchOutlined />
      ),
      sorter: true,
      sortOrder: sort.sortBy === 'lastName' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
    },
    {
      title: formatMessage({ id: "page.users.column.name" }),
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
      title: (
        <Space>
          {formatMessage({ id: "page.users.column.email" })}
          {isFilteringOrSorting && sort.sortBy === 'email' && (
            <Spin indicator={<LoadingOutlined />} />
          )}
        </Space>
      ),
      dataIndex: 'email',
      key: 'email',
      width: 250,
      sorter: true,
      sortOrder: sort.sortBy === 'email' ? (sort.sortOrder === 'asc' ? 'ascend' : 'descend') : null,
      render: (email) => <Typography.Text copyable>{email}</Typography.Text>,
    },
    {
      title: formatMessage({ id: "page.users.column.image" }),
      dataIndex: 'image',
      key: 'image',
      width: 100,
      render: (image, record) => (
        <Avatar
          src={image}
          size={40}
          icon={<UserOutlined />}
          alt={`${record.firstName} ${record.lastName}`}
        />
      ),
    },
  ], [isFilteringOrSorting, filters.firstName, filters.lastName, sort.sortBy, sort.sortOrder, formatMessage]);

  const handleTableChange: TableProps<UsersTableData>['onChange'] = (
    pagination,
    filterInfo,
    sorter
  ) => {
    // Handle pagination
    if (pagination) {
      setCurrentPage(pagination.current || 1);
      setPageSize(pagination.pageSize || 13);
    }

    // Handle sorting
    if (sorter && !Array.isArray(sorter)) {
      if (sorter.order) {
        setSort({
          sortBy: sorter.field as string,
          sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
        });
      } else {
        setSort({});
      }
      // Reset to first page when sorting changes
      setCurrentPage(1);
    }

    // Handle filtering
    const newFilters: UsersFilterParams = {};
    if (filterInfo?.firstName && Array.isArray(filterInfo.firstName)) {
      newFilters.firstName = filterInfo.firstName[0] as string;
    }
    if (filterInfo?.lastName && Array.isArray(filterInfo.lastName)) {
      newFilters.lastName = filterInfo.lastName[0] as string;
    }

    // Only update if filters actually changed
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
      // Reset to first page when filters change
      setCurrentPage(1);
    }
  };

  return (
    <ContentLayout>
      <Card className="relative">
        <Table<UsersTableData>
          columns={columns}
          dataSource={tableData}
          loading={{
            spinning: isLoading,
            tip: formatMessage({ id: "page.users.loading.fetching" }),
          }}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} ${formatMessage({ id: "page.users.pagination.total" })}`,
            pageSizeOptions: ['13', '25', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 'max-content' }}
          size="middle"
          bordered
          showSorterTooltip={{
            title: formatMessage({ id: "page.users.sort.tooltip" }),
          }}
        />
      </Card>
    </ContentLayout>
  );
}