// a component that display a list of events from the firebase database
import { ref, onValue, query, orderByChild } from "firebase/database";
import React, { useEffect, useState } from "react";
import db from "../db";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { PrevArrow, NextArrow } from "../components/Arrows";
import Slider from "react-slick";
import { formatDate } from "../utils";

export default function Events() {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const eventsRef = ref(db, "events");
        onValue(query(eventsRef, orderByChild("is_at")), (snapshot) => {
            const events = [];
            snapshot.forEach((child) => {
                events.push({
                    id: child.key,
                    ...child.val(),
                });
            });
            setEvents(events.reverse());
        });
    }, []);
    /**
     * @type {import("react-slick").Settings}
     */
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        slidesToShow: 3,
        slidesToScroll: 3,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true,
                },
            },
            {
                breakpoint: 600,
                settings: "unslick",
            },
        ],
    };
    return (
        <div className="container mt-3 mb-3">
            <h2>Unsere Events:</h2>
            <div className="container">
                {events.length ? (
                    <Slider {...settings}>
                        {events.map((event) => (
                            <div
                                key={event.id}
                                className="card border border-1 p-3"
                            >
                                <h3 className="card-title">{event.title}</h3>
                                <div className="card-body">
                                    <p>{event.description}</p>
                                    <p>{formatDate(new Date(event.is_at))}</p>
                                </div>
                            </div>
                        ))}
                    </Slider>
                ) : (
                    "Keine Events anstehend"
                )}
            </div>
        </div>
    );
}
