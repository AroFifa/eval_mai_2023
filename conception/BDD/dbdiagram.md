



Table Brand {
  id integer [pk]
  brand_name varchar 

}

Table Cpu {
  id integer [pk]
  cpu_name varchar
}

Table DiskType {
  id integer [pk]
  type_name varchar
}

Table Ram {
  id integer [pk]
  ram_name varchar
  ram_value double
}

Table Screen {
  id integer [pk]
  size_name varchar
  size_value double
}


Table Model {
  id integer [pk]
  brand_id integer [ref: > Brand.id]
  model_name varchar
  screen_id integer [ref: > Screen.id]
  cpu_id integer [ref: > Cpu.id]
  ram_id integer [ref: > Ram.id]
  disktype_id integer [ref: > DiskType.id]
  disk_size double
}

Table LapTop {
  id integer [pk]
  model_id integer [ref: > Model.id]
  sales_price double
}

Table StoreCategory {
  id integer [pk]
  category_name varchar
  level smallint
}

Table Location {
  id integer [pk]
  location_name varchar
}

Table Store {
  id integer [pk]
  category_id integer [ref: > StoreCategory.id]
  location_id integer [ref: > Location.id]
  store_name varchar
}

Table Profil {
  id integer [pk]
  profil_name varchar
  level smallint
}

Table Employee {
  id integer [pk]
  profil_id integer [ref: > Profil.id]
  firstname varchar
  lastname varchar
  birthday date
  email varchar
  passwd varchar
}

Table Manager {
  employee_id integer [pk, ref: - Employee.id]
  store_id integer [ref: > Store.id]
}

Table Purchase {
  id integer [pk]
  laptop_id integer [ref: > LapTop.id]
  qtt smallint
  purchase_price double
  purchase_date date
  manager_id integer [ref: > Manager.employee_id]
}

Table Stock_status {
  id integer [pk]
  status_name varchar
  status_value smallint
}

Table Transaction_type {
  id integer [pk]
  transaction_name varchar
  transaction_level smallint
}

Table Stock {
  id integer [pk]
  transaction_date date
  store_id integer [ref: > Store.id]
  laptop_id integer [ref: > LapTop.id]
  qtt smallint
  status_id integer [ref: > Stock_status.id]
  transaction_id integer [ref: > Transaction_type.id]
}

Table Transfer {
  id integer [pk]
  transfer_date date
  manager_id integer [ref: > Manager.employee_id]
  store_from integer [ref: > Store.id]
  store_to integer [ref: > Store.id]
  stock_id integer [ref: > Stock.id]
  qtt smallint 
}

Table Validation_status {
  id integer [pk]
  status_name varchar
  status_value smallint
}

Table Reception {
  id integer [pk]
  validation_date date
  validation_status integer [ref: > Validation_status.id]
  manager_id integer [ref: > Manager.employee_id]
  qtt_received smallint
}

Table Sale {
  id integer [pk]
  laptop_id integer [ref: > LapTop.id]
  qtt smallint
  purchase_date date
  purchase_price double
  clientName varchar
  store_id integer [ref: > Store.id]

}
