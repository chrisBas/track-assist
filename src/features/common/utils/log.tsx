class Log {
  info(event: string, data: any) {
    console.log({ status: 'info', data, event });
  }

  success(event: string, data: any) {
    console.log({ status: 'success', data, event });
  }

  error(event: string, data: any) {
    console.error({ status: 'error', data, event });
  }
}

const log = new Log();
export default log;
