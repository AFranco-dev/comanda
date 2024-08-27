<?php
session_start();// Inicia una nueva sesión o reanuda la sesión existente
require_once '../models/mtoPedido.php';// Incluye el archivo que contiene la definición de la clase 'Pedido'
require_once '../models/mtoMesa.php';// Incluye el archivo que contiene la definición de la clase 'Mesa'
require_once '../models/mtoProducto.php';// Incluye el archivo que contiene la definición de la clase 'Producto'

header('Content-Type: application/json');// Establece el tipo de contenido de la respuesta como JSON

$response = array();// Inicializa un array para almacenar la respuesta
$method = $_SERVER['REQUEST_METHOD'];// Obtiene el método HTTP de la solicitud actual (GET, POST, PUT, DELETE)

try {
    //$pedidoModel = new Pedido();// Crea una instancia del modelo de 'Pedido'
    $mesaModel = new Mesa();// Crea una instancia del modelo de 'Mesa'
    $productoModel = new Producto();// Crea una instancia del modelo de 'Producto'

    switch ($method) {// Verifica el método HTTP de la solicitud y actúa en consecuencia
        case 'GET':
            if(isset($_GET['mesa'])){// Si la solicitud es GET y se pasa un parámetro 'mesa', obtendra las mesas disponibles del restaurante
                $response = $mesaModel->mesasDisponibles(); //Se asigna el condenido del metodo en la variable $response
            }
            else if (isset($_GET['productos'])) {// Si la solicitud es GET y se pasa un parámetro 'productos', obtendra todos los productos
                $response = $productoModel->obtenerProductos();
            }
            break;
        case 'PUT':
            // Decodifica el cuerpo de la solicitud JSON en un array asociativo
            $data = json_decode(file_get_contents("php://input"), true);
            // Verifica que se haya pasado los campos
            if (!isset($data['num_mesa']) || !isset($data['estado'])) {
                // Si no, lanza una excepción indicando datos incompletos
                throw new Exception('Datos incompletos');
            }
            // Llama al método update del modelo para actualizar la mesa especificada con cantidad de personas y estado
            $mesaModel->update2($data['num_mesa'], $data['estado']);
            // Establece la respuesta indicando éxito
            $response = ['status' => 'success', 'message' => 'Mesa actualizada con éxito'];
            break;
        default: // Si se utiliza un método HTTP no soportado, lanza una excepción
            throw new Exception('Método no permitido');
    }
} catch (Exception $e) {// Captura cualquier excepción y establece la respuesta indicando error
    $response = ['status' => 'error', 'message' => $e->getMessage()];
}

echo json_encode($response);// Codifica el array de respuesta en formato JSON y lo imprime
?>