package com.example.restaurante;

import com.google.android.gms.maps.model.LatLng;

public class Restaurant {
    private String name;
    private String type;
    private float rating;
    private LatLng location;

    public Restaurant(String name, String type, float rating, LatLng location) {
        this.name = name;
        this.type = type;
        this.rating = rating;
        this.location = location;
    }

    public String getName() { return name; }
    public String getType() { return type; }
    public float getRating() { return rating; }
    public LatLng getLocation() { return location; }
}
