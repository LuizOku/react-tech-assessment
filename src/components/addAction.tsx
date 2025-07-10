import { PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React from "react";

interface AddActionProps {
  title: React.ReactNode;
  onClick: () => void;
  style?: any;
}

const AddAction = ({ title, onClick, style = {} }: AddActionProps) => {
  return (
    <Button
      icon={<PlusCircleOutlined />}
      type="default"
      onClick={onClick}
      shape="round"
    >
      {title}
    </Button>
  );
};

export default AddAction;
