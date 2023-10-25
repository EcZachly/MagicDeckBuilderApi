CREATE TABLE events (event_id:VARCHAR(25) PRIMARY KEY, user_id:VARCHAR(25) FOREIGN KEY, name : VARCHAR(20), Year: DATE)

CREATE TABLE event_incomes (income_id:VARCHAR(25) PRIMARY KEY, event_id FOREIGN KEY, amount:FLOAT(20), commission_artist:FLOAT(20), commission_event:FLOAT(20), commission_note:VARCHAR(55), payment_type:VARCHAR(10), payment_date: DATE(), payment_amount:FLOAT(20), payment_note:VARCHAR(20))

CREATE TABLE event_expenses (expense_id:VARCHAR(25) PRIMARY KEY, event_id:VARCHAR(25) FOREIGN KEY, expense_type:VARCHAR(25), expense_amount:FLOAT(20), expense_date:DATE())

CREATE TABLE event_products (relation_id:VARCHAR(25) PRIMARY KEY, product_id:VARCHAR(25) FOREIGN KEY, event_id: VARCHAR(25) FOREIGN KEY)

-- relation_id is either an event or a gallery
CREATE TABLE contact_info (contact_id:VARCHAR(25) PRIMARY KEY, relation_id:VARCHAR(25) FOREIGN KEY, type:VARCHAR(10), display_mode:VARCHAR(15),  display_name:VARCHAR(25), display_phone:VARCHAR(25), display_email:VARCHAR(25), display_address_street:VARCHAR(25), display_address_city:VARCHAR(25), display_address_state:VARCHAR(25), display_address_zip:VARCHAR(25))

CREATE TABLE galleries (gallery_id:VARCHAR(25) PRIMARY KEY, user_id:VARCHAR(25) FOREIGN KEY, name:VARCHAR(25), commission_artist:FLOAT(2), commission_gallery:FLOAT(2), visibility:BOOLEAN, active:BOOLEAN)

CREATE TABLE users (user_id:VARCHAR(25) PRIMARY KEY, name:VARCHAR(25), email:VARCHAR(25), password:VARCHAR(25), public_view_image:BOOLEAN, public_view_size:BOOLEAN, public_view_price:BOOLEAN, public_view_gallery:BOOLEAN, public_view_image:BOOLEAN, public_view_sold:BOOLEAN, public_view_medium:BOOLEAN, public_view_genre:BOOLEAN, custom_url:VARCHAR(20), public_view_contact_info:BOOLEAN)

-- WHEN user deletes a default set active to false
CREATE TABLE user_defaults (default_id:VARCHAR(25) PRIMARY KEY, user_id:VARCHAR(25) FOREIGN KEY, default_type:VARCHAR(25), default_value:VARCHAR(25), active:BOOLEAN)

CREATE TABLE products (product_id:VARCHAR(25) PRIMARY KEY, user_id:VARCHAR(25) FOREIGN KEY, gallery_id:VARCHAR(25) FOREIGN KEY,  name:VARCHAR(25), display_mode:VARCHAR(10), medium_id:VARCHAR(25), status_id:VARCHAR(25), type_id:VARCHAR(25), genre_id:VARCHAR(25), comments:VARCHAR(55), start_date:DATE, completion_date:DATE, availability:VARCHAR(15), price_retail:FLOAT(20), price_sold:FLOAT(20))

-- entity_type == gallery, event, user, product
-- image_type = thumbnail, full
CREATE TABLE images (image_id:VARCHAR(25) PRIMARY KEY, entity_id:VARCHAR(25) FOREIGN KEY, entity_type:VARCHAR(10), image_url:VARCHAR(20), image_type:VARCHAR(10))

-- payments, expenses, events
CREATE TABLE product_timeline (timeline_id:VARCHAR(25) PRIMARY KEY, product_id:VARCHAR(25) FOREIGN KEY, timeline_type:VARCHAR(10), timeline_date:DATE, timeline_description:VARCHAR(25), value:FLOAT(20), value_type:VARCHAR(25))

CREATE INDEX product_index (name || user:UNIQUE)




-- QUERY TO GET ALL DIRECT AND INDIRECT EXPENSES BY PRODUCT



SELECT SUM(evx.expense_amount) AS indirect_expense_total, SUM(pt.value) AS direct_expense_total, pro.name AS product_name FROM event_expenses evx 
	INNER JOIN event_products evp ON evx.event_id = evp.event_id
	INNER JOIN products pro ON pro.product_id = evp.product_id
	INNER JOIN product_timeline pt ON pt.product_id = pro.product_id
	WHERE pt.type = 'expense'
	GROUP BY pro.name
	LIMIT 5
	ORDER BY indirect_expense_total DESC




