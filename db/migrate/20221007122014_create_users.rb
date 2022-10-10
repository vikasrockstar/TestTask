class CreateUsers < ActiveRecord::Migration[7.0]
  def change
    create_table :users do |t|
      t.string :email, unique: true, require: true
      t.string :first_name, require: true
      t.string :last_name, require: true
      t.string :nickname, null: true
      t.string :phone_number, require: true
      t.timestamps
    end
  end
end
