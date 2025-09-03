import GroupPage from "./GroupPage";

export default async function SingleGroupPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <GroupPage id={id} />
    </div>
  );
}
