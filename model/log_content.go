package model

import (
	"context"
	"errors"

	"gorm.io/gorm"
)

type LogContent struct {
	Id            int    `json:"id" gorm:"primaryKey;autoIncrement"`
	LogId         int    `json:"log_id" gorm:"uniqueIndex"`
	InputContent  string `json:"input_content" gorm:"type:text"`
	OutputContent string `json:"output_content" gorm:"type:text"`
}

func InsertLogContent(logContent *LogContent) error {
	return LOG_DB.Create(logContent).Error
}

func GetLogContentByLogId(logId int) (*LogContent, error) {
	var content LogContent
	err := LOG_DB.Where("log_id = ?", logId).First(&content).Error
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &content, nil
}

func DeleteLogContentByLogId(logId int) error {
	return LOG_DB.Where("log_id = ?", logId).Delete(&LogContent{}).Error
}

func GetLogContentByRequestId(requestId string) (*LogContent, error) {
	if requestId == "" {
		return nil, nil
	}
	var log Log
	if err := LOG_DB.Where("request_id = ?", requestId).First(&log).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return GetLogContentByLogId(log.Id)
}

func DeleteOldLogContent(ctx context.Context, logIds []int) error {
	if len(logIds) == 0 {
		return nil
	}
	return LOG_DB.WithContext(ctx).Where("log_id IN ?", logIds).Delete(&LogContent{}).Error
}