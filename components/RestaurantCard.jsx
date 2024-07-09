import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
// import { getCurrentLocation, haversineDistance } from "../utils";
import PhoneIcon from "./icons/PhoneIcon";
import ClockIcon from "./icons/ClockIcon";
import MapPinIcon from "./icons/MapPinIcon";

const RestaurantCard = ({ restaurant }) => {
    //   const [distance, setDistance] = useState();

    //   const getLocation = async () => {
    //     try {
    //       const location = await getCurrentLocation();
    //       return location;
    //     } catch (error) {
    //       console.error("Error obtaining location:", error);
    //     }
    //   };

    //   useEffect(() => {
    //     const calculateDistance = async () => {
    //       try {
    //         getLocation().then((location) => {
    //           const restaurantLocation = {
    //             latitude: restaurant.basic_information.latitude,
    //             longitude: restaurant.basic_information.longitude,
    //           };
    //           const dist = haversineDistance(location, restaurantLocation);
    //           setDistance(dist);
    //         });
    //       } catch (error) {
    //         console.error("Error calculating distance:", error);
    //       }
    //     };

    //     calculateDistance();
    //   }, [restaurant]);

    return (
        <View style={styles.card}>
            <Image
                style={styles.image}
                source={{ uri: restaurant.img }}
                alt="Sunset in the mountains"
            />
            <View style={styles.infoContainer}>
                <View style={styles.header}>
                    <Text style={styles.title}>
                        {restaurant.basic_information.name}
                    </Text>
                    <Text style={styles.tag}>
                        {restaurant.basic_information.kind_food}
                    </Text>
                </View>

                <View style={styles.info}>
                    <MapPinIcon size={16} color="#38b2ac" />
                    <Text style={styles.text}>
                        {restaurant.basic_information.direction}
                    </Text>
                </View>
                <View style={styles.info}>
                    <ClockIcon size={16} color="#38b2ac" />
                    <Text style={styles.text}>
                        {restaurant.basic_information.schedule}
                    </Text>
                </View>
                <View style={styles.info}>
                    <PhoneIcon size={16} color="#38b2ac" />
                    <Text style={styles.text}>{restaurant.basic_information.phone}</Text>
                </View>
            </View>
            {/* <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>
          Distancia: {distance?.toFixed(2)} km
        </Text>
      </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        
        borderRadius: 8,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        backgroundColor: "#fff",
        marginBottom: 16,
    },
    image: {
        width: "100%",
        height: 250,
    },
    infoContainer: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 160,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontWeight: "bold",
        fontSize: 18,
    },
    tag: {
        backgroundColor: "#e2e8f0",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 4,
        fontSize: 12,
        fontWeight: "600",
        color: "#4a5568",
    },
    info: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    text: {
        fontSize: 12,
        color: "#4a5568",
        marginLeft: 8,
    },
    distanceContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    distanceText: {
        fontSize: 12,
    },
});

export default RestaurantCard;
