class User < ApplicationRecord
  validates_uniqueness_of :email
  validates_presence_of :email, :first_name, :last_name, :phone_number
  has_many :employments
end
