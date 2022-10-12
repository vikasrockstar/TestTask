class UsersController < ApplicationController
  protect_from_forgery with: :exception, unless: -> { request.format.json? }
  before_action :set_user, only: [:update]

  def index
    render json: User.all, status: 200
  end

  def create
    user = User.create(user_params)
    raise ActiveRecord::RecordInvalid if user.errors.any?
    render json: user, status: 201
  rescue ActiveRecord::RecordInvalid
    render json: user.errors, status: 400
  end

  def update
    employment = @user.employments.create(employment_params)
    raise ActiveRecord::RecordInvalid if employment&.errors.any?
    render json: @user.employments, status: 200
  rescue ActiveRecord::RecordInvalid
    render json: employment.errors, status: 400
  end

  private

  def set_user
    @user = User.find(params[:id])
  rescue ActiveRecord::RecordNotFound
    render json: 'User Not Found', status: 400
  end

  def user_params
    params.require(:user).permit(:email, :first_name, :last_name, :nickname, :phone_number)
  end

  def employment_params
    params.require(:employment).permit(:employer_name, :start_date, :end_date)
  end
end
