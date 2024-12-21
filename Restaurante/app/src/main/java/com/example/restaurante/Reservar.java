package com.example.restaurante;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class Reservar extends AppCompatActivity {

    // Declaración de variables para los campos del formulario
    private EditText editNombreCompleto, editCorreo, editFecha, editHora, editNumeroPersonas;
    private Button btnConfirmarReserva;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.reservar);

        // Inicialización de los widgets (referencia al layout)
        editNombreCompleto = findViewById(R.id.editNombreCompleto);
        editCorreo = findViewById(R.id.editCorreo);
        editFecha = findViewById(R.id.editFecha);
        editHora = findViewById(R.id.editHora);
        editNumeroPersonas = findViewById(R.id.editNumeroPersonas);
        btnConfirmarReserva = findViewById(R.id.btnConfirmarReserva);

        // Configuración del listener para el botón Confirmar Reserva
        btnConfirmarReserva.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                // Recuperación de valores de los campos
                String nombreCompleto = editNombreCompleto.getText().toString().trim();
                String correo = editCorreo.getText().toString().trim();
                String fecha = editFecha.getText().toString().trim();
                String hora = editHora.getText().toString().trim();
                String numeroPersonas = editNumeroPersonas.getText().toString().trim();

                // Validación de campos vacíos
                if (nombreCompleto.isEmpty() || correo.isEmpty() || fecha.isEmpty() ||
                        hora.isEmpty() || numeroPersonas.isEmpty()) {
                    Toast.makeText(Reservar.this, "Por favor completa todos los campos", Toast.LENGTH_SHORT).show();
                } else {
                    // Guardar los valores (se pueden enviar a otra actividad o servidor)
                    Toast.makeText(Reservar.this,
                            "Reserva Confirmada:\n" +
                                    "Nombre: " + nombreCompleto + "\n" +
                                    "Correo: " + correo + "\n" +
                                    "Fecha: " + fecha + "\n" +
                                    "Hora: " + hora + "\n" +
                                    "Número de Personas: " + numeroPersonas,
                            Toast.LENGTH_LONG).show();

                    // Aquí puedes agregar lógica adicional, por ejemplo:
                    // - Guardar en una base de datos.
                    // - Enviar a un servidor.
                    // - Navegar a otra actividad.
                }
            }
        });
    }
}
