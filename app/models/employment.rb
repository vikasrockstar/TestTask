class Employment < ApplicationRecord
  belongs_to :user
  validates_presence_of :employer_name, :start_date, :end_date
end
