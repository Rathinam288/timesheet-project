import * as React from 'react';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

const margin = { right: 24 };
const data = [0, 10, 70, 60, 70, 80];
const xData = ['Website\nRedesign', 'Mobile\nApp', 'AI\nResearch', 'CMS\nDevelopment','Migration','Cloud\nIntegration'];
export default function LineChartConnectNulls() {
  return (
    <>
    <Stack spacing={2} sx={{ width:'fit-content',borderRadius:3,boxShadow:1,padding:3,backgroundColor:'white'}}>
    <Typography align='center' variant='h6' fontSize='21px' fontWeight={600} gutterBottom> Project Completion Overview  </Typography>
      <LineChart
        xAxis={[{ data: xData, scaleType: 'point', tickLabelStyle:{whiteSpace:'pre-line',fontSize:12,},tickLabelInterval:0, }]}
        series={[{ data, connectNulls: true }]}
        height={200}
        width={600}
        margin={margin}
      />
    </Stack>
    </>
  );
}



