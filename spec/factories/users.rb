FactoryBot.define do
  factory :user do
    email {Faker::Internet.email}
    first_name {Faker::Name.name}
    last_name {Faker::Name.name}
    phone_number {Faker::PhoneNumber.phone_number}
  end
end
