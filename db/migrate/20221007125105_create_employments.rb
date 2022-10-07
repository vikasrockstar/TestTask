class CreateEmployments < ActiveRecord::Migration[7.0]
  def change
    create_table :employments do |t|
      t.string :employer_name, require: true
      t.datetime :start_date, require: true
      t.datetime :end_date, require: true
      t.timestamps
    end
  end
end
