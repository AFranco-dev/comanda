$(document).ready(function () {

    var cancelID = null;

    //Funcion para cargar los pedidos existentes
    function cargarPedidos() {
        $.ajax({
            url: '../controllers/EstadoController.php?pedidos=true',
            type: 'GET',
            dataType: 'json',
            success: function (response) {
                console.log(response);
                var pedidoTabla = $('#tablePedidos').DataTable();
                pedidoTabla.clear(); // Limpia las filas
                response.forEach(function (pedido) {                    
                    pedidoTabla.row.add([
                        pedido.id_pedido,
                        pedido.fecha_pedido,
                        pedido.estado,
                        pedido.num_mesa,
                        pedido.mesero,
                        '<button type="button" id="updatePedido" class="btn bg-gradient-info" data-id="' + pedido.id_pedido + '" data-bs-toggle="modal" data-bs-target="#detalleModal"">Modificar</button>',
                        '<button type="button" id="cancelarPedido" class="btn bg-gradient-danger" data-id="' + pedido.id_pedido + '">Cancelar</button>'
                    ]).draw();
                }); 
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error("Error al cargar los pedidos:", textStatus, errorThrown);
            }
        });
    }

    // Cargar datos en la tabla
    cargarPedidos();

    // Inicializa DataTables
    $('#tablePedidos').DataTable({
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
        }
    });

    $(document).on('click', '#updatePedido', function() {
        var id = $(this).data('id');
        $.ajax({
            url: '../controllers/EstadoController.php?id_pedido='+id,
            type: 'GET',
            dataType: 'JSON',
            success: function(response) {
                $('#btns').empty();
                $('#fin').empty();
                $('#btns').append('<button type="button" id="newProduct" class="btn bg-gradient-info toast-btn" data-bs-toggle="modal" data-bs-target="#productModal">+ PRODUCTO</button>');
                $('#fin').append('<div class="mb-2"><button type="button" id="modificarPedido" class="btn bg-gradient-warning toast-btn">Modificar Pedido</button></div>');
                var productsTable = $('#productsTable').DataTable();
                productsTable.clear();
                response.forEach(function(producto) {
                    productsTable.row.add([
                        producto.nombre,
                        producto.cantidad,
                        ''
                    ]).draw();
                    
                });
            },
            error: function(jqXHR, textStatus, errorThrown) {
                //showMessage('danger', "Error al cargar productos: " + textStatus + " - " + errorThrown);
            }
        });
    });

    // Inicializa DataTables
    $('#productsTable').DataTable({
        "language": {
            "url": "https://cdn.datatables.net/plug-ins/1.11.3/i18n/es_es.json"
        }
    });

    ///
    $('#tablePedidos').on('click', '#cancelarPedido', function() {
        cancelID = $(this).data('id'); // Obtener el ID de la categoría a eliminar
        $('#confirmCancelModal').modal('show'); // Mostrar el modal de confirmación de eliminación
    });

    // Confirmar la eliminación de la categoría
    $('#confirmCancelButton').click(function() {
        if (cancelID !== null) {
            $.ajax({// Enviar solicitud AJAX para eliminar la categoría
                url: '../controllers/EstadoController.php',
                type: 'PUT',
                contentType: 'application/json',
                data: JSON.stringify({ id: cancelID }),
                success: function(response) {
                    $('#confirmCancelModal').modal('hide'); // Ocultar el modal de confirmación
                    cargarPedidos(); // Actualizar la lista de categorías
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // Mostrar mensaje de error
                    //showMessage('danger', "Error en la solicitud: " + textStatus + " - " + errorThrown);
                }
            });
        }
    });

});
