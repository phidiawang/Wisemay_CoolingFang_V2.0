################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../../../makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../src/S12ZVM_system/startup_CW/mc9s12zvml32.c" \
"../src/S12ZVM_system/startup_CW/startup.c" \

C_SRCS += \
../src/S12ZVM_system/startup_CW/mc9s12zvml32.c \
../src/S12ZVM_system/startup_CW/startup.c \

OBJS += \
./src/S12ZVM_system/startup_CW/mc9s12zvml32_c.obj \
./src/S12ZVM_system/startup_CW/startup_c.obj \

OBJS_QUOTED += \
"./src/S12ZVM_system/startup_CW/mc9s12zvml32_c.obj" \
"./src/S12ZVM_system/startup_CW/startup_c.obj" \

C_DEPS += \
./src/S12ZVM_system/startup_CW/mc9s12zvml32_c.d \
./src/S12ZVM_system/startup_CW/startup_c.d \

C_DEPS_QUOTED += \
"./src/S12ZVM_system/startup_CW/mc9s12zvml32_c.d" \
"./src/S12ZVM_system/startup_CW/startup_c.d" \

OBJS_OS_FORMAT += \
./src/S12ZVM_system/startup_CW/mc9s12zvml32_c.obj \
./src/S12ZVM_system/startup_CW/startup_c.obj \


# Each subdirectory must supply rules for building sources it contributes
src/S12ZVM_system/startup_CW/mc9s12zvml32_c.obj: ../src/S12ZVM_system/startup_CW/mc9s12zvml32.c
	@echo 'Building file: $<'
	@echo 'Executing target #6 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/startup_CW/mc9s12zvml32.args" -o "src/S12ZVM_system/startup_CW/mc9s12zvml32_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/S12ZVM_system/startup_CW/%.d: ../src/S12ZVM_system/startup_CW/%.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '

src/S12ZVM_system/startup_CW/startup_c.obj: ../src/S12ZVM_system/startup_CW/startup.c
	@echo 'Building file: $<'
	@echo 'Executing target #7 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/S12ZVM_system/startup_CW/startup.args" -o "src/S12ZVM_system/startup_CW/startup_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '


