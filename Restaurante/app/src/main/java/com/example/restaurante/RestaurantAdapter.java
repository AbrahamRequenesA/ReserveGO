package com.example.restaurante;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.recyclerview.widget.RecyclerView;

import java.util.List;

public class RestaurantAdapter extends RecyclerView.Adapter<RestaurantAdapter.ViewHolder> {

    private List<Restaurant> restaurantList;

    public RestaurantAdapter(List<Restaurant> restaurantList) {
        this.restaurantList = restaurantList;
    }

    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        // Inflar el layout para cada ítem
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.restaurant_item, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(ViewHolder holder, int position) {
        // Asignar datos a las vistas
        Restaurant restaurant = restaurantList.get(position);
        holder.restaurantName.setText(restaurant.getName());
        holder.restaurantType.setText(restaurant.getType());
        holder.restaurantRating.setText(String.valueOf(restaurant.getRating()));
    }

    @Override
    public int getItemCount() {
        return restaurantList.size();
    }

    // ViewHolder para cada ítem del RecyclerView
    public static class ViewHolder extends RecyclerView.ViewHolder {
        TextView restaurantName;
        TextView restaurantType;
        TextView restaurantRating;

        public ViewHolder(View itemView) {
            super(itemView);
            restaurantName = itemView.findViewById(R.id.restaurantName);
            restaurantType = itemView.findViewById(R.id.restaurantType);
            restaurantRating = itemView.findViewById(R.id.restaurantRating);
        }
    }
}
