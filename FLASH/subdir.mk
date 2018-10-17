################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../Wisemay_CoolingFan_V2.0.c" \

C_SRCS += \
../Wisemay_CoolingFan_V2.0.c \

OBJS += \
./Wisemay_CoolingFan_V2_0_c.obj \

OBJS_QUOTED += \
"./Wisemay_CoolingFan_V2_0_c.obj" \

C_DEPS += \
./Wisemay_CoolingFan_V2_0_c.d \

C_DEPS_QUOTED += \
"./Wisemay_CoolingFan_V2_0_c.d" \

OBJS_OS_FORMAT += \
./Wisemay_CoolingFan_V2_0_c.obj \


# Each subdirectory must supply rules for building sources it contributes
Wisemay_CoolingFan_V2_0_c.obj: ../Wisemay_CoolingFan_V2.0.c
	@echo 'Building file: $<'
	@echo 'Executing target #25 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"Wisemay_CoolingFan_V2.0.args" -o "./Wisemay_CoolingFan_V2_0_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

Wisemay_CoolingFan_V2_0_c.d: ../Wisemay_CoolingFan_V2.0.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '


