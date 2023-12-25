import { app } from '../main'
import { IRestResponse } from './types'
import axios from 'axios';

interface IGetReportDataPara {
  ReportType: number;
  BeginDate?: string;
  EndDate?: string;
}

// 工器具接口
export async function getToolData(type, control, data): Promise<IRestResponse> {
  
  const appSettings = app.config.globalProperties.$appSettings;
  const baseUrl = appSettings.restUrl
  const url = baseUrl + type + "/" + control + "/process";

  const response = await axios.post(url,data );
  return response.data;
}
