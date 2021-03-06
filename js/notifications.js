$(document).ready(function()
{
	var hints = $('.translatable span.hint');
	if (youEditFieldFor)
		hints.html(hints.html() + '<br /><span class="red">' + youEditFieldFor + '</span>');

	var html = "";		
	var nb_notifs = 0;
	var wrapper_id = "";
	var type = new Array();
	
	$(".notifs").click(function(){
		var wrapper_id = $(this).parent().attr("id");

		$.post(
			"ajax.php",
			{
				"updateElementEmployee" : "1",
				"updateElementEmployeeType" : $(this).parent().attr('data-type')
			},
			function(data) {
				if (data) {
					$("#" + wrapper_id + "_value").html(0);
					$("#" + wrapper_id + "_number_wrapper").hide();
				}				
			}
		);
	});

	// call it once immediately, then use setTimeout if refresh is activated
	getPush(autorefresh_notifications);
});

function getPush(refresh)
{
	$.post("ajax.php",{"getNotifications" : "1"}, function(data) {
		if (data)
		{
			var json = jQuery.parseJSON(data);

			// Add orders notifications to the list
			html = "";
			$.each(json.order.results, function(property, value) {
				html += "<a href='index.php?tab=AdminOrders&token=" + token_admin_orders + "&vieworder&id_order=" + parseInt(value.id_order) + "' class='media list-group-item no_notifs'>";
				html += "<span class='pull-left'><i class='icon-time'></i></span>";
				html += "<span class='media-body'>";
				//html += "<p>" + new_order_msg + "</p>";
				html += "<p>" + order_number_msg + "&nbsp;<strong>#" + parseInt(value.id_order) + "</strong></p>";
				html += "<p class='pull-right'>" + total_msg + "&nbsp;<span class='label label-success'>" + value.total_paid + "</span></p>";
				html += "<p>" + from_msg + "&nbsp;<strong>" + value.customer_name + "</strong></p>";
				//html += "<p>" + see_order_msg + "</p>";
				html += "<small class='text-muted'>1 minute ago</small>";
				html += "</span></a>";
			});
			if (parseInt(json.order.total) > 0)
			{
				//$("#list_orders_notif").prev("p").hide();
				$("#list_orders_notif").empty().append(html);
				$("#orders_notif_value").text(json.order.total);
				$("#orders_notif_number_wrapper").show();
			}
			else
				$("#orders_notif_number_wrapper").hide();
			
			// Add customers notifications to the list
			html = "";
			$.each(json.customer.results, function(property, value) {
				html += "<a href='index.php?tab=AdminCustomers&token=" + token_admin_customers + "&viewcustomer&id_customer=" + parseInt(value.id_customer) + "' class='media list-group-item no_notifs'>";
				html += "<span class='pull-left'><i class='icon-time'></i></span>";
				html += "<span class='media-body'>";
				//html += "<p>" + new_customer_msg + "</p>";
				html += "<p>" + customer_name_msg + "&nbsp;<strong>#" + value.customer_name + "</strong></p>";
				//html += "<p>" + see_customer_msg + "</p>";
				html += "<small class='text-muted'>1 minute ago</small>";
				html += "</span></a>";
			});						
			if (parseInt(json.customer.total) > 0)
			{
				//$("#list_customers_notif").prev("p").hide();
				$("#list_customers_notif").empty().append(html);
				$("#customers_notif_value").text(json.customer.total);
				$("#customers_notif_number_wrapper").show();
			}
			else
				$("#customers_notif_number_wrapper").hide();

			// Add messages notifications to the list
			html = "";
			$.each(json.customer_message.results, function(property, value) {
				html += "<a href='index.php?tab=AdminCustomerThreads&token=" + token_admin_customer_threads + "&viewcustomer_thread&id_customer_thread=" + parseInt(value.id_customer_thread) + "'>";
				html += "<span class='pull-left'><i class='icon-time'></i></span>";
				html += "<span class='media-body'>";
				//html += "<p>" + new_msg + "</p>";
				html += "<p>" + from_msg + "&nbsp;<strong>" + value.customer_name + "</strong></p>";
				//html += "<p>" + see_msg + "</p>";
				html += "<small class='text-muted'>1 minute ago</small>";
				html += "</span></a>";
			});

			if (parseInt(json.customer_message.total) > 0)
			{
				// $("#list_customer_messages_notif").prev("p").hide();
				$("#list_customer_messages_notif").empty().append(html);
				$("#customer_messages_notif_value").text(json.customer_message.total);
				$("#customer_messages_notif_number_wrapper").show();
			}
			else
				$("#customer_messages_notif_number_wrapper").hide();
		}
		if (refresh)
			setTimeout("getPush(1)", 120000);
	});
}