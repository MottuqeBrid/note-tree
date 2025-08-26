import EditUserForm from "./EditUserForm";

export default async function UpdateProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <EditUserForm id={id} />
    </div>
  );
}
