FactoryBot.define do
  factory :employment do
    user { association :user }
    employer_name {Faker::Company.name}
    start_date {Faker::Date.in_date_period}
    end_date {Faker::Date.in_date_period}
  end
end
