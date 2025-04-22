import UploadFrom from "./_components/uploadForm/S3UploadFrom";

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard page</h1>
      <UploadFrom />
    </div>
  );
}
