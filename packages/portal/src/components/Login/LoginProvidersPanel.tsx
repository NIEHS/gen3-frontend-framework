import React from "react";
import { Box, Button, LoadingOverlay, Select, Stack } from "@mantine/core";
import { useGetLoginProvidersQuery } from "@gen3/core";
import type { Gen3LoginProvider, NameUrl } from "@gen3/core";

interface LoginPanelProps {
  readonly referenceURL: string;
  readonly handleLoginSelected: (_: string) => void;
}

const LoginProvidersPanel: React.FC<LoginPanelProps> = ({
  handleLoginSelected,
}: LoginPanelProps) => {
  const { data, isSuccess } = useGetLoginProvidersQuery();

  if (!isSuccess) return <LoadingOverlay visible={!isSuccess} />;
  if (data) {
    return (

      <Box sx={{ maxWidth: 300 }} >
        <Stack>
          <Button
            color="accent.7"
            onClick={() => handleLoginSelected(data.default_provider.url)}
          >
            {data.default_provider.name}
          </Button>
          {data?.providers.map((x: Gen3LoginProvider) => {
            if (x.name === data.default_provider.name) return null;
            if (x.urls.length == 1)
              return (
                <Button
                  key={x.name}
                  className="bg-heal-purple"
                  onClick={() => handleLoginSelected(x.urls[0].url)}
                >
                  {" "}
                  {x.name}{" "}
                </Button>
              );
            else {
              const selectData = x.urls.map((item: NameUrl) => ({
                value: item.url,
                label: item.name,
              }));
              return (
                <div className="flex flex-col" key={`${x.name}-login-item`}>
                  <Select data={selectData} />
                  <Button
                    key={x.name}
                    className="bg-heal-purple"
                    onClick={() => handleLoginSelected(x.urls[0].url)}
                  >
                    {" "}
                    {x.name}
                  </Button>
                </div>
              );
            }
          })}
        </Stack>
      </Box>
    );
  }
  return null;
};

export default LoginProvidersPanel;
