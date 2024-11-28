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
    databaseText = `Conexões Abertas: ${data.dependencies.database.opened_connections} Versão: ${data.dependencies.database.version} Máximo de Conexões: ${data.dependencies.database.max_connections}`;
  }
  return <div>Informação sobre o Banco de Dados: {databaseText}</div>;
}

function loadingValue() {
  return "Carregando...";
}
