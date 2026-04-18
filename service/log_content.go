package service

import (
	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/setting/operation_setting"

	"github.com/gin-gonic/gin"
)

func ExtractInputContent(info *relaycommon.RelayInfo) string {
	if !operation_setting.IsLogContentEnabled() {
		return ""
	}
	if info.Request == nil {
		return ""
	}
	contentBytes, err := common.Marshal(info.Request)
	if err != nil {
		return ""
	}
	return string(contentBytes)
}

func SetInputContentToContext(c *gin.Context, info *relaycommon.RelayInfo) {
	if !operation_setting.IsLogContentEnabled() {
		return
	}
	inputContent := ExtractInputContent(info)
	if inputContent != "" {
		common.SetContextKey(c, constant.ContextKeyInputContent, inputContent)
	}
}

func GetInputContentFromContext(c *gin.Context) string {
	return common.GetContextKeyString(c, constant.ContextKeyInputContent)
}

func GetOutputContentFromContext(c *gin.Context) string {
	return common.GetContextKeyString(c, constant.ContextKeyOutputContent)
}