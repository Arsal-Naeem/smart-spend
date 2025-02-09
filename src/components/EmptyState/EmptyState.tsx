import { Empty } from "antd";
import { EmptyProps } from "antd/es/empty";

interface EmptyStateProps extends Omit<EmptyProps, "description"> {
  description?: string | React.ReactNode;
}

const EmptyState = ({
  description = "No data available",
  ...props
}: EmptyStateProps) => {
  return (
    <Empty
    //   image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={description}
      {...props}
      style={{margin: "2rem 0"}}
    />
  );
};

export default EmptyState;
