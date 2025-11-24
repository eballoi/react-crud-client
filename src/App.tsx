import { CrudProvider, useGetList, useGetOne, useCreate } from "./index";

const App = () => (
  <CrudProvider config={{ baseUrl: "https://api.syndi.dev.orionware.io/chat/api" }}>
    <Users />
  </CrudProvider>
);

function Users() {
  const { data: conversations } = useGetList<{ id: string; name: string }>("conversations");
  console.log('conv', conversations)
  return (
    <ul>
      a
    </ul>
  );
}
