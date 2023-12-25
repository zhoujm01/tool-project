import { app } from '../main'
import { IRestResponse } from '../api/types'
import axios from 'axios';

interface IGetReportDataPara {
  ReportType: number;
  BeginDate?: string;
  EndDate?: string;
}

// =============================================
// 获取report数据
// =============================================
export async function getReportData(e: IGetReportDataPara): Promise<IRestResponse> {

  const appSettings = app.config.globalProperties.$appSettings;
  const baseUrl = appSettings.restUrl

  const url = baseUrl + "selectDiagnosis";
  const config = appSettings.restConfig;
  const params = JSON.stringify({

  });

  const response = await axios.get(url);
  return response.data;
}


// 删除图片
export async function deleteImg(params?: string): Promise<IRestResponse> {

  const appSettings = app.config.globalProperties.$appSettings;
  const baseUrl = appSettings.restUrl

  const url = baseUrl + "deleteimg" + "?driving=" + params;
  const config = appSettings.restConfig;

  const response = await axios.get(url);
  return response.data;
}

// 修改数据

export async function changeReportData(key, control, data): Promise<IRestResponse> {
  
  const appSettings = app.config.globalProperties.$appSettings;
  const baseUrl = appSettings.restUrl
  const url = baseUrl + key + "/" + control + "/diagnosis";

  const response = await axios.post(url,data );
  return response.data;
}

// 单表查询接口
export async function changeData(key, control, data): Promise<IRestResponse> {
  
  const appSettings = app.config.globalProperties.$appSettings;
  const baseUrl = appSettings.restUrl
  const url = baseUrl + key + "/" + control + "/diagnosis2";

  const response = await axios.post(url,data );
  return response.data;
}