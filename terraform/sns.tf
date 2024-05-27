resource "aws_sns_topic" "foglalo_notification_topic" {
  name = "foglalo_notification_topic"
}

resource "aws_sns_topic_subscription" "foglalo_notification_sms_sub" {
  topic_arn = aws_sns_topic.foglalo_notification_topic.arn
  endpoint  = "+36706838528"
  protocol  = "sms"
}

resource "aws_sns_topic_subscription" "foglalo_notification_email_sub" {
  topic_arn = aws_sns_topic.foglalo_notification_topic.arn
  endpoint  = "northbrid@gmail.com"
  protocol  = "email"
}
