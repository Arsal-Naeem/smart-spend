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
      image="/emptyWallet.png"
      description={description}
      {...props}
      style={{
        margin: "2rem 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
        opacity: 0.5,
      }}
    />
  );
};

export default EmptyState;
