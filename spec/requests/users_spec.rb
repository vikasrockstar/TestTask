require 'rails_helper'

RSpec.describe "Users", type: :request do
  describe "GET /index" do
    it "returns http success" do
      get 'http://127.0.0.1:3000/users'
      expect(JSON.parse(response.body)).to eq(User.all)
      expect(response.status).to eq(200)
    end
  end

  describe "POST /users" do
    scenario "valid user attributes" do
      post 'http://127.0.0.1:3000/users', params: {
        "user": {
          "email":"vk@gmail.com",
          "first_name":"vikas",
          "last_name":"kumar",
          "nickname":"vk",
          "phone_number":"9876543210"
        }
      }
      expect(response.status).to eq(201)
      json = JSON.parse(response.body).deep_symbolize_keys
      # check the value of the returned response hash
      expect(json[:email]).to eq('vk@gmail.com')
      expect(json[:first_name]).to eq('vikas')
      expect(json[:last_name]).to eq('kumar')
      expect(json[:nickname]).to eq('vk')
      expect(json[:phone_number]).to eq('9876543210')


      # 1 new user record is created
      expect(User.count).to eq(1)

      # Optionally, you can check the latest record data
      expect(User.last.email).to eq('vk@gmail.com')
    end

    scenario "invalid user attributes" do
      post 'http://127.0.0.1:3000/users', params: {
        "user": {
          "email":"",
          "first_name":"",
          "last_name":"",
          "nickname":"vk",
          "phone_number":"9876543210"
        }
      }
      expect(response.status).to eq(400)
      json = JSON.parse(response.body).deep_symbolize_keys

      # check the value of the returned response hash
      expect(json[:email]).to eq(["can't be blank"])
      expect(json[:first_name]).to eq(["can't be blank"])
      expect(json[:last_name]).to eq(["can't be blank"])
    end
  end

  describe "PUT /users/id" do
    scenario "valid employment attributes" do
      post 'http://127.0.0.1:3000/users', params: {
        "user": {
          "email":"vk@gmail.com",
          "first_name":"vikas",
          "last_name":"kumar",
          "nickname":"vk",
          "phone_number":"9876543210"
        }
      }
      user_id = JSON.parse(response.body).deep_symbolize_keys[:id]
      start_date = 3.year.since
      end_date = 1.year.since

      put "http://127.0.0.1:3000/users/#{user_id}", params: {
        "employment": {
          "employer_name":"web",
          "start_date": start_date,
          "end_date": end_date
        }
      }
      expect(response.status).to eq(200)
      json = JSON.parse(response.body).first.deep_symbolize_keys
      # check the value of the returned response hash
      expect(json[:employer_name]).to eq('web')

      # 1 new user record is created
      expect(Employment.count).to eq(1)

      # Optionally, you can check the latest record data
      expect(Employment.last.employer_name).to eq('web')
    end

    scenario "invalid user attributes" do
      post 'http://127.0.0.1:3000/users', params: {
        "user": {
          "email":"vk@gmail.com",
          "first_name":"vikas",
          "last_name":"kumar",
          "nickname":"vk",
          "phone_number":"9876543210"
        }
      }
      user_id = JSON.parse(response.body).deep_symbolize_keys[:id]

      put "http://127.0.0.1:3000/users/#{user_id}", params: {
        "employment": {
          "employer_name":"",
          "start_date":"",
          "end_date":""
        }
      }
      expect(response.status).to eq(400)
      json = JSON.parse(response.body).deep_symbolize_keys

      # check the value of the returned response hash
      expect(json[:employer_name]).to eq(["can't be blank"])
      expect(json[:start_date]).to eq(["can't be blank"])
      expect(json[:end_date]).to eq(["can't be blank"])
    end
  end
end
