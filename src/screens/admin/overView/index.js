import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Card } from "react-native-elements";
import { LineChart, BarChart } from "react-native-chart-kit";
import moment from "moment";

import * as firebase from "firebase";
import { AuthenticatedUserContext } from "../../navigation/AuthenticatedUserProvider";

const AdminOverViewScreen = ({ navigation }) => {
  const [currentMonthData, setCurrentMonthData] = useState({
    revenue: "",
    haircuts: "",
    goatPoints: "",
  });

  const barData = {
    labels: ["Revenue", "GoatPoints"],
    datasets: [
      {
        data: [currentMonthData.revenue, currentMonthData.goatPoints],
      },
    ],
  };
  // const linedata = {
  //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  //     datasets: [
  //       {
  //         data: [20, 45, 28, 80, 99, 43],
  //         strokeWidth: 3, // optional
  //       },
  //     ],
  //   };

  function subtractDiscount(revenue, goatPoints) {
    const discount = Number(revenue.replace(/[$.]+/g, "")) - Number(goatPoints);
    return (discount / 100).toFixed(2);
  }

  useEffect(() => {
    async function getOverViewData() {
      await firebase
        .firestore()
        .collection("Calendar")
        .doc(moment().format("MMM YY"))
        .collection("OverView")
        .doc("data")
        .get()
        .then((doc) => {
          setCurrentMonthData({ ...currentMonthData, ...doc.data() });
        });
    }
    getOverViewData();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text style={styles.text}>
                Bezier Line Chart
            </Text> */}
      {/* <LineChart
                    data={linedata}
                    width={Dimensions.get('window').width} // from react-native
                    height={220}
                    yAxisLabel={'$'}
                    chartConfig={{
                    backgroundColor: '#e26a00',
                    backgroundGradientFrom: '#fb8c00',
                    backgroundGradientTo: '#ffa726',
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: {
                        borderRadius: 16
                    }
                    }}
                    bezier
                    style={{
                    marginVertical: 8,
                    borderRadius: 16
                    }}
                /> */}
      <BarChart
        // style={graphStyle}
        data={barData}
        width={Dimensions.get("window").width}
        height={220}
        yAxisLabel={"$"}
        chartConfig={{
          backgroundColor: "#e26a00",
          backgroundGradientFrom: "#fb8c00",
          backgroundGradientTo: "#ffa726",
          decimalPlaces: 2, // optional, defaults to 2dp
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
      />
      <View style={{ flex: 0.5 }}>
        <Card
          containerStyle={{
            flex: 1,
            margin: 10,
            backgroundColor: "#121212",
            borderColor: "#000",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <Card.Title style={{ color: "#E8BD70", fontSize: 15 }}>
            Total Haircuts for 'Selected Month'
          </Card.Title>
          <Card.Divider />
          <Text style={{ color: "#E8BD70", fontSize: 15 }}>
            Total Haircuts: {currentMonthData.haircuts}
          </Text>
          <Text style={{ color: "#E8BD70", fontSize: 15 }}>
            Projected Revenue: ${currentMonthData.revenue}
          </Text>
          <Text style={{ color: "#E8BD70", fontSize: 15 }}>
            Total GoatPoints: {currentMonthData.goatPoints} = $
            {(currentMonthData.goatPoints / 100).toFixed(2)}
          </Text>
          <Text style={{ color: "#E8BD70", fontSize: 15 }}>
            Total Revenue: $
            {subtractDiscount(
              currentMonthData.revenue,
              currentMonthData.goatPoints
            )}
          </Text>
        </Card>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  text: {
    color: "#fff",
  },
  ListItem: {
    backgroundColor: "#121212",
  },
});

export default AdminOverViewScreen;
