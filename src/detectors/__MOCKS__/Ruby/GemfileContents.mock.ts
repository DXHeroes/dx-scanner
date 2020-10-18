export const gemfileContents = `
# frozen_string_literal: true

source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "2.7.1"
gem "rails", "~> 6.0.3"

gem "after_party"
gem "devise" # comment with incorrect version 8.8.8
gem "jbuilder", "~> 2.10" # with ~>
gem "bootsnap", ">= 1.4.2", require: false # with >= and require
gem "pg", ">= 0.18", "< 2.0" # multiple restrictions
gem "amazing_print", "~> 3.3.3", ">= 2.0" # multiple restrictions with 4.4.4 in comment
gem "byebug", platforms: %i[mri mingw x64_mingw] # with platform

group :development, :test do
    gem "factory_bot_rails" # in groups
    gem "rspec-rails", "~> 4.0.1" # in groups with restriction
end
`;
