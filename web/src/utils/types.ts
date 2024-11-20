export interface SocketData {
  timestamp: number;
  value: {
    accelarationX: number;
    accelarationY: number;
    accelarationZ: number;
    gyroX: number;
    gyroY: number;
    gyroZ: number;
    temperature: number;
    gas: number;
    interval: number;
  };
}

export interface DataPoint {
  value: number;
  timestamp: number;
}
