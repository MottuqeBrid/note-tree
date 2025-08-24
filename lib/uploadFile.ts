const uploadFile = async (file: File) => {
  const formData = new FormData();

  formData.append("file", file);
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/files`, {
    method: "POST",
    body: formData,
    credentials: "include",
  });

  const resData = await res.json();
  return resData;
};
export { uploadFile };
