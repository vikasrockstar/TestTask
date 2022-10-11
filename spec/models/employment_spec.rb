require 'rails_helper'

RSpec.describe Employment, type: :model do
  subject(:user) {build(:user)}
  subject(:employment) { build(:employment, user: user) }

  describe 'validations' do
    specify 'validate presence of user, employer_name, start_date, end_date' do
      expect(employment).to validate_presence_of(:employer_name).on(:create)
      expect(employment).to validate_presence_of(:start_date).on(:create)
      expect(employment).to validate_presence_of(:end_date).on(:create)
    end

    it { employment.user.present? == true }
  end
end
