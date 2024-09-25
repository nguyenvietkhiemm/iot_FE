import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Cookies from 'js-cookie'; // Thư viện để lấy cookies
import { tokens } from "../theme";
import moment from "moment";  // For formatting timestamps
// Đảm bảo URL chính xác với port của backend

const token = Cookies.get('token'); // Lấy token từ cookie

const socket = io('http://localhost:3000', {
  extraHeaders: {
    'token': token // Gửi token trong header
  },
  withCredentials: true // Cho phép gửi cookies
});

const xValues = ["-9", "-8", "-7", "-6", "-5", "-4", "-3", "-2", "-1", "now"];
var lightYValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var humidityYValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var heatYValues = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const createData = (id, color, yValues) => {
  return {
    id,
    color,
    data: xValues.map((x, index) => ({
      x,
      y: yValues[index]
    })),
  };
};

const useSocket = () => {
  const [dataSensors, setDataSensors] = useState([
    createData("LIGHT", tokens("dark").yellowAccent[500], lightYValues),
    createData("HUMIDITY", tokens("dark").blueAccent[300], humidityYValues),
    createData("HEAT", tokens("dark").redAccent[300], heatYValues),
  ]);
  const [dataDevices, setDataDevices] = useState({
    "1": 0,
    "2": 0,
    "3": 0
  });

  useEffect(() => {
    // Khi kết nối thành công
    socket.on('connect', () => {
      console.log('Connected to server');
    });

    // Lắng nghe sự kiện 'data' từ server
    socket.on('data', (newData) => {
      if (newData.topic === "data/sensor") {
        const now = new Date();  // Get current time
        const formattedTime = moment(now).format("HH:mm:ss");

        const light = newData.data["l"];
        const humidity = newData.data["h"];
        const heat = newData.data["t"];

        lightYValues.push(light);
        humidityYValues.push(humidity);
        heatYValues.push(heat);
        xValues.push(formattedTime);

        if (lightYValues.length > 10) {
          lightYValues.shift();
        }
        if (humidityYValues.length > 10) {
          humidityYValues.shift();
        }
        if (heatYValues.length > 10) {
          heatYValues.shift();
        }
        if (xValues.length > 10) {
          xValues.shift();
        }

        const newDataSensors = [
          createData("LIGHT", tokens("dark").yellowAccent[500], lightYValues),
          createData("HUMIDITY", tokens("dark").blueAccent[300], humidityYValues),
          createData("HEAT", tokens("dark").redAccent[300], heatYValues),
        ];

        setDataSensors(newDataSensors);
      }
      else if (newData.topic === "data/led") {
        setDataDevices(newData.data);
      }
    });

    // Cleanup khi component unmount
    return () => {
      if (socket.connected) {
        console.log("disconnected");
        socket.disconnect();
      }
      socket.off('data');
    };
  }, []);

  const sendControlData = (controlData) => {
    return new Promise((resolve, reject) => {
      socket.emit('control', controlData, (response) => {
        if (response && response.success) {
          resolve(response); // Gửi thành công
        } else {
          reject(new Error('Failed to send control data')); // Có lỗi xảy ra
        }
      });
    });
  };

  return { dataSensors, dataDevices, sendControlData };
};

export default useSocket;
