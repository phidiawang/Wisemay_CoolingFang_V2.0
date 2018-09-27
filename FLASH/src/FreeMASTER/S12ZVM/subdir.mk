################################################################################
# Automatically-generated file. Do not edit!
################################################################################

-include ../../../makefile.local

# Add inputs and outputs from these tool invocations to the build variables 
C_SRCS_QUOTED += \
"../src/FreeMASTER/S12ZVM/freemaster_HC12.c" \

C_SRCS += \
../src/FreeMASTER/S12ZVM/freemaster_HC12.c \

OBJS += \
./src/FreeMASTER/S12ZVM/freemaster_HC12_c.obj \

OBJS_QUOTED += \
"./src/FreeMASTER/S12ZVM/freemaster_HC12_c.obj" \

C_DEPS += \
./src/FreeMASTER/S12ZVM/freemaster_HC12_c.d \

C_DEPS_QUOTED += \
"./src/FreeMASTER/S12ZVM/freemaster_HC12_c.d" \

OBJS_OS_FORMAT += \
./src/FreeMASTER/S12ZVM/freemaster_HC12_c.obj \


# Each subdirectory must supply rules for building sources it contributes
src/FreeMASTER/S12ZVM/freemaster_HC12_c.obj: ../src/FreeMASTER/S12ZVM/freemaster_HC12.c
	@echo 'Building file: $<'
	@echo 'Executing target #24 $<'
	@echo 'Invoking: S12Z Compiler'
	"$(S12Z_ToolsDirEnv)/mwccs12lisa" -c @@"src/FreeMASTER/S12ZVM/freemaster_HC12.args" -o "src/FreeMASTER/S12ZVM/freemaster_HC12_c.obj" "$<" -MD -gccdep
	@echo 'Finished building: $<'
	@echo ' '

src/FreeMASTER/S12ZVM/%.d: ../src/FreeMASTER/S12ZVM/%.c
	@echo 'Regenerating dependency file: $@'
	
	@echo ' '


