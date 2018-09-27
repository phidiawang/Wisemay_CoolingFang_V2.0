################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../src/AddFunction.c" \
"../src/actuate_s12zvm.c" \
"../src/meas_s12zvm.c" \
"../src/state_machine.c" \

C_SRCS += \
../src/AddFunction.c \
../src/actuate_s12zvm.c \
../src/meas_s12zvm.c \
../src/state_machine.c \

OBJS += \
./src/AddFunction_c.obj \
./src/actuate_s12zvm_c.obj \
./src/meas_s12zvm_c.obj \
./src/state_machine_c.obj \

OBJS_QUOTED += \
"./src/AddFunction_c.obj" \
"./src/actuate_s12zvm_c.obj" \
"./src/meas_s12zvm_c.obj" \
"./src/state_machine_c.obj" \

C_DEPS += \
./src/AddFunction_c.d \
./src/actuate_s12zvm_c.d \
./src/meas_s12zvm_c.d \
./src/state_machine_c.d \

C_DEPS_QUOTED += \
"./src/AddFunction_c.d" \
"./src/actuate_s12zvm_c.d" \
"./src/meas_s12zvm_c.d" \
"./src/state_machine_c.d" \

OBJS_OS_FORMAT += \
./src/AddFunction_c.obj \
./src/actuate_s12zvm_c.obj \
./src/meas_s12zvm_c.obj \
./src/state_machine_c.obj \


# Each subdirectory must supply rules for building sources it contributes
src/AddFunction_c.obj: ../src/AddFunction.c
	@echo 'Building file: $<'
	@echo 'Executing target #1 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/AddFunction.args" -o "src/AddFunction_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/%.d: ../src/%.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '

src/actuate_s12zvm_c.obj: ../src/actuate_s12zvm.c
	@echo 'Building file: $<'
	@echo 'Executing target #2 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/actuate_s12zvm.args" -o "src/actuate_s12zvm_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/meas_s12zvm_c.obj: ../src/meas_s12zvm.c
	@echo 'Building file: $<'
	@echo 'Executing target #3 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/meas_s12zvm.args" -o "src/meas_s12zvm_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/state_machine_c.obj: ../src/state_machine.c
	@echo 'Building file: $<'
	@echo 'Executing target #4 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/state_machine.args" -o "src/state_machine_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '


