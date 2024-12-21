package com.example.restaurante;

import android.Manifest;
import android.app.DatePickerDialog;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.Spinner;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapView;
import com.google.android.gms.maps.MapsInitializer;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.libraries.places.api.Places;
import com.google.android.libraries.places.api.net.PlacesClient;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

public class MainActivity extends AppCompatActivity {

    private static final int LOCATION_PERMISSION_REQUEST_CODE = 1001;

    private EditText dateInput;
    private Spinner citySpinner;
    private ImageView iconLogin, iconCreateAccount;
    private MapView mapView;
    private GoogleMap googleMap;
    private RecyclerView recyclerView;
    private List<Restaurant> restaurantList;
    private RestaurantAdapter restaurantAdapter;

    private PlacesClient placesClient;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Inicializar componentes
        initializeComponents();

        // Configurar íconos para Login y Registro
        setupNavigation();

        // Configurar Spinner y DatePicker
        setupSpinner();
        setupDatePicker();

        // Configurar RecyclerView
        setupRecyclerView();

        // Configurar MapView
        setupMapView(savedInstanceState);

        // Solicitar permisos de ubicación si no están concedidos
        checkLocationPermission();

        // Inicializa Places
        if (!Places.isInitialized()) {
            Places.initialize(getApplicationContext(), "AIzaSyB78UbXtiHkumkRzO3tC0no0C5A98yBkZM");
        }
        placesClient = Places.createClient(this);

        // Configura el resto del mapa y los componentes
        initializeComponents();
    }

    private void initializeComponents() {
        iconLogin = findViewById(R.id.iconLogin);
        iconCreateAccount = findViewById(R.id.iconCreateAccount);
        dateInput = findViewById(R.id.dateInput);
        citySpinner = findViewById(R.id.citySpinner);
        recyclerView = findViewById(R.id.restaurantRecyclerView);
        mapView = findViewById(R.id.mapView);
    }

    private void setupNavigation() {
        iconLogin.setOnClickListener(v -> startActivity(new Intent(this, LoginActivity.class)));
        iconCreateAccount.setOnClickListener(v -> startActivity(new Intent(this, CrearCuenta.class)));
    }

    private void setupSpinner() {
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(this, R.array.cities, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        citySpinner.setAdapter(adapter);

        citySpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                String selectedCity = parentView.getItemAtPosition(position).toString();
                Toast.makeText(MainActivity.this, "Ciudad seleccionada: " + selectedCity, Toast.LENGTH_SHORT).show();
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
                // No hacer nada
            }
        });
    }

    private void setupDatePicker() {
        dateInput.setOnClickListener(v -> {
            Calendar calendar = Calendar.getInstance();
            int year = calendar.get(Calendar.YEAR);
            int month = calendar.get(Calendar.MONTH);
            int day = calendar.get(Calendar.DAY_OF_MONTH);

            new DatePickerDialog(this, (view, year1, monthOfYear, dayOfMonth) -> {
                String selectedDate = dayOfMonth + "/" + (monthOfYear + 1) + "/" + year1;
                dateInput.setText(selectedDate);
            }, year, month, day).show();
        });
    }

    private void setupRecyclerView() {
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        restaurantList = new ArrayList<>();
        restaurantAdapter = new RestaurantAdapter(restaurantList);
        recyclerView.setAdapter(restaurantAdapter);
    }

    private void setupMapView(Bundle savedInstanceState) {
        if (mapView != null) {
            mapView.onCreate(savedInstanceState);
            mapView.onResume();
            mapView.getMapAsync(map -> {
                googleMap = map;
                MapsInitializer.initialize(MainActivity.this);

                if (ContextCompat.checkSelfPermission(MainActivity.this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    googleMap.setMyLocationEnabled(true);
                    googleMap.setOnMyLocationChangeListener(location -> {
                        LatLng userLocation = new LatLng(location.getLatitude(), location.getLongitude());
                        googleMap.moveCamera(CameraUpdateFactory.newLatLngZoom(userLocation, 14));
                        addRestaurantMarkers(userLocation);
                    });
                } else {
                    Toast.makeText(MainActivity.this, "Habilita los permisos de ubicación", Toast.LENGTH_SHORT).show();
                }
            });
        }
    }

    private void checkLocationPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, LOCATION_PERMISSION_REQUEST_CODE);
        }
    }

    private void addRestaurantMarkers(LatLng userLocation) {
        // Generar ubicaciones ficticias de restaurantes cerca del usuario
        restaurantList.clear();
        restaurantList.add(new Restaurant("MOCHOMOS", "Mexicana", 4.5f, new LatLng(userLocation.latitude + 0.002, userLocation.longitude + 0.002)));
        restaurantList.add(new Restaurant("Restaurante 2", "Italiana", 4.0f, new LatLng(userLocation.latitude - 0.003, userLocation.longitude - 0.002)));
        restaurantList.add(new Restaurant("Restaurante 3", "Japonesa", 4.7f, new LatLng(userLocation.latitude + 0.004, userLocation.longitude - 0.003)));

        // Actualizar los marcadores en el mapa
        googleMap.clear();
        for (Restaurant restaurant : restaurantList) {
            googleMap.addMarker(new MarkerOptions()
                    .position(restaurant.getLocation())
                    .title(restaurant.getName())
                    .snippet("Calificación: " + restaurant.getRating()));
        }

        // Actualizar el RecyclerView
        restaurantAdapter.notifyDataSetChanged();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == LOCATION_PERMISSION_REQUEST_CODE) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                setupMapView(null); // Reintentar configurar el mapa
            } else {
                Toast.makeText(this, "Permiso de ubicación denegado", Toast.LENGTH_SHORT).show();
            }
        }
    }

}
