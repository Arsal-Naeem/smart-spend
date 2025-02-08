import CategoryGrid from "@/components/CategoryGrid/CategoryGrid";
import MainLayout from "@/components/MainLayout/MainLayout";

export default function Categories() {
  return (
    <MainLayout>
      <div
        style={{
          padding: "16px",
          color: "var(--color-accent)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Categories</h2>
      </div>
      <CategoryGrid />
    </MainLayout>
  );
}
