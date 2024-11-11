export default async function AuthErrorPage({ searchParams }) {
  const { error } = await searchParams;

  return (
    <div>
      <p>오류 발생: </p>
      <p>{error}</p>
    </div>
  );
}
