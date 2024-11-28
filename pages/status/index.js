import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function statusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <Database />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
  let updatedAtText = loadingValue();

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText}</div>;
}

function Database() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let databaseText = loadingValue();

  if (!isLoading && data) {
    databaseText = `Opened connections: ${data.dependencies.database.opened_connections} Version: ${data.dependencies.database.version} Max Connections: ${data.dependencies.database.max_connections}`;

    return <div>Database Information: {databaseText}</div>;
  }
}

function loadingValue() {
  return "Carregando...";
}
